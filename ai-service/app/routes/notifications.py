"""
CareerForge AI Service - Motivation & Notification Routes
=========================================================
Endpoints:
- GET  /api/ai/notifications/{student_id}       : Get student notification history & unread count
- POST /api/ai/notifications/dispatch           : Evaluate and dispatch eligible notifications
- POST /api/ai/notifications/trigger            : Manually trigger a specific reminder type
- PATCH /api/ai/notifications/{notification_id}/read : Mark notification as read
- DELETE /api/ai/notifications/{notification_id}     : Dismiss a notification
"""

from fastapi import APIRouter, HTTPException, status, Path, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.services.notification_service import notification_service
from app.utils.logger import logger

router = APIRouter(prefix="/api/ai/notifications", tags=["Motivation & Reminders"])


class DispatchRemindersRequest(BaseModel):
    student_id: str = Field(..., description="Unique student identifier")


class TriggerReminderRequest(BaseModel):
    student_id: str = Field(..., description="Unique student identifier")
    reminder_type: str = Field(
        ...,
        description="Type: daily_learning, incomplete_task, learning_streak, milestone_notification, assessment_reminder, interview_practice"
    )
    force: Optional[bool] = Field(default=False, description="Bypass cooldown anti-spam throttling for testing")
    milestone_data: Optional[Dict[str, Any]] = Field(default=None, description="Required for milestone_notification")


@router.get("/{student_id}")
async def get_notifications_endpoint(
    student_id: str = Path(..., description="Student identifier"),
    status: Optional[str] = Query(None, description="Filter by status: unread, read, dismissed"),
    limit: Optional[int] = Query(20, ge=1, le=100, description="Max records to retrieve")
):
    """
    Retrieves the student's notification history and unread count from MongoDB.
    """
    try:
        return await notification_service.get_student_notifications(
            student_id=student_id,
            status_filter=status,
            limit=limit or 20
        )
    except Exception as e:
        logger.error(f"Error fetching notifications for '{student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch notifications: {str(e)}"
        )


@router.post("/dispatch")
async def dispatch_reminders_endpoint(payload: DispatchRemindersRequest):
    """
    Scans student's active roadmap, streak, and recent assessments,
    evaluating and dispatching all non-throttled reminders.
    """
    try:
        dispatched = await notification_service.evaluate_and_dispatch_reminders(payload.student_id)
        return {
            "status": "success",
            "student_id": payload.student_id,
            "dispatched_count": len(dispatched),
            "dispatched": dispatched
        }
    except Exception as e:
        logger.error(f"Error dispatching reminders for '{payload.student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to dispatch reminders: {str(e)}"
        )


@router.post("/trigger")
async def trigger_specific_reminder_endpoint(payload: TriggerReminderRequest):
    """
    Triggers a specific reminder type for a student.
    """
    try:
        res = None
        rtype = payload.reminder_type.lower()

        if rtype in ("daily_learning", "daily"):
            res = await notification_service.generate_daily_learning_reminder(payload.student_id, force=payload.force)
        elif rtype in ("incomplete_task", "task"):
            res = await notification_service.generate_incomplete_task_reminder(payload.student_id, force=payload.force)
        elif rtype in ("learning_streak", "streak"):
            res = await notification_service.generate_streak_reminder(payload.student_id, force=payload.force)
        elif rtype in ("milestone_notification", "milestone"):
            m_data = payload.milestone_data or {"step_id": 1, "title": "Foundation Phase"}
            res = await notification_service.generate_milestone_notification(payload.student_id, m_data)
        elif rtype in ("assessment_reminder", "assessment"):
            res = await notification_service.generate_assessment_reminder(payload.student_id, force=payload.force)
        elif rtype in ("interview_practice", "interview"):
            res = await notification_service.generate_interview_reminder(payload.student_id, force=payload.force)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported reminder type: {payload.reminder_type}")

        if res is None:
            return {
                "status": "throttled",
                "message": f"Notification '{payload.reminder_type}' was throttled by anti-spam cooldown."
            }

        return {
            "status": "created",
            "notification": res
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error triggering reminder for '{payload.student_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger reminder: {str(e)}"
        )


@router.patch("/{notification_id}/read")
async def mark_notification_read_endpoint(
    notification_id: str = Path(..., description="Notification identifier")
):
    """
    Marks a notification as read.
    """
    try:
        success = await notification_service.mark_as_read(notification_id)
        if not success:
            raise HTTPException(status_code=404, detail="Notification not found")
        return {"status": "success", "notification_id": notification_id, "read": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking notification '{notification_id}' read: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark notification read: {str(e)}"
        )


@router.delete("/{notification_id}")
async def dismiss_notification_endpoint(
    notification_id: str = Path(..., description="Notification identifier")
):
    """
    Dismisses a notification.
    """
    try:
        success = await notification_service.dismiss_notification(notification_id)
        if not success:
            raise HTTPException(status_code=404, detail="Notification not found")
        return {"status": "success", "notification_id": notification_id, "dismissed": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error dismissing notification '{notification_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to dismiss notification: {str(e)}"
        )
