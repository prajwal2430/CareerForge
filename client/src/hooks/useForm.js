import { useState } from 'react';

/**
 * Custom hook for handling form state and submission.
 * @param {Object} initialValues - Initial form field values
 * @param {Function} onSubmit - Async function to call on form submit
 */
const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // Clear field error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await onSubmit(values);
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, loading, handleChange, handleSubmit, resetForm, setErrors };
};

export default useForm;
