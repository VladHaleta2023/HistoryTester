import Swal from 'sweetalert2';

export const showAlert = (status, title, message) => {
    status = String(status);

    switch (status) {
        case "200":
            Swal.fire({
                title,
                text: message,
                icon: 'success',
                confirmButtonText: 'OK',
            });
            break;
        case "400":
            Swal.fire({
                title,
                text: message,
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            break;
        case "500":
            Swal.fire({
                title,
                text: message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            break;
        default:
            Swal.fire({
                title,
                text: message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            break;
    }
}