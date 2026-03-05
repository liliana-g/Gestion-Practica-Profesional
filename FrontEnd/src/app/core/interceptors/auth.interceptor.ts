import { HttpInterceptorFn } from "@angular/common/http";

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {

    const csrf = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

    const authReq = req.clone({
        withCredentials: true,
        headers: req.headers.set('X-CSRFToken', csrf || '')
    });

    return next(authReq);

};