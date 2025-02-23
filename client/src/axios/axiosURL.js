const getAxiosURL = () => {
    const origin = window.location.origin;
    if (origin === process.env.REACT_APP_API_URL_LOCAL_CLIENT)
        return process.env.REACT_APP_API_URL_LOCAL_SERVER;
    else
        return process.env.REACT_APP_API_URL;
}

export default getAxiosURL;