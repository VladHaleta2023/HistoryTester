export const show_hide_password = (target, inputId) => {
    var input = document.querySelector(`input#${inputId}`);
    if (input.getAttribute('type') === 'password') {
        target.setAttribute('src', 'password-no-view.svg');
        input.setAttribute('type', 'text');
        return 'text';
    } else {
        target.setAttribute('src', 'password-view.svg');
        input.setAttribute('type', 'password');
        return 'password';
    }
}