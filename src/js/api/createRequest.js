const createRequest = (options = {}) => {
  if (
    !options.requestMethod ||
    !options.url ||
    !options.host ||
    !options.callback
  ) {
    return;
  }
  try {
    const url = `${options.host}${options.url}`;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      const data = JSON.parse(xhr.response);
      if (xhr.status === 200 || xhr.status === 409) {
        options.callback(data);
      }
    });
    xhr.open(options.requestMethod, url);
    xhr.send(JSON.stringify(options.body));
  } catch (error) {
    console.log("error");
  }
};

export default createRequest;
