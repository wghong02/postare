const handleResponseStatus = (response, errMsg) => {
  // handle http response, if 401, unauthorized so remove auth token;
  // if other response that are not ok, throw the corresponding error
  const { status, ok } = response;

  if (status === 401) {
    localStorage.removeItem("authToken");
    window.location.reload();
    return;
  }

  if (!ok) {
    throw Error(errMsg);
  }
};

export default handleResponseStatus;
