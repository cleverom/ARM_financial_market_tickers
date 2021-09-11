import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,

  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

const success = (title, message = '') =>
  Toast.fire({
    icon: 'success',
    title,
    text: message
  });
const errors = (title, message = '') =>
  Toast.fire({
    icon: 'error',
    title,
    text: message
  });

const swalService = { success, errors };
export default swalService;
export { success, errors };
