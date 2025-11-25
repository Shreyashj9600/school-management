import Swal from 'sweetalert2';

const showSuccess = async (title, text) => {
  return Swal.fire({
    position: 'center',
    icon: 'success',
    title: title || 'Success!',
    text: text || 'Operation completed successfully.',
    showConfirmButton: true,
    confirmButtonColor: '#2563eb',
  });
};

const showError = async (title, text) => {
  return Swal.fire({
    position: 'center',
    icon: 'error',
    title: title || 'Error!',
    text: text || 'An error occurred. Please try again.',
    confirmButtonColor: '#dc2626',
  });
};

const showConfirm = async (title, text, confirmButtonText = 'Yes') => {
  return Swal.fire({
    title: title || 'Are you sure?',
    text: text || "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmButtonText,
    cancelButtonText: 'Cancel'
  });
};


const academic_years = [
  { year: '2024-2025' },
  { year: '2025-2026' },
  { year: '2026-2027' },
  { year: '2027-2028' },
  { year: '2028-2029' },  
  { year: '2029-2030' },
  { year: '2030-2031' },
  { year: '2031-2032' },
  { year: '2032-2033' },
  { year: '2033-2034' },
  { year: '2034-2035' },
  { year: '2035-2036' },
  { year: '2036-2037' },
  { year: '2037-2038' },
  { year: '2038-2039' },
  { year: '2039-2040' },
  { year: '2040-2041' },
  { year: '2041-2042' },
  { year: '2042-2043' },
  { year: '2043-2044' },
]

export { showSuccess, showError, showConfirm, academic_years };
