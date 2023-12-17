const createRequest = (options = {}) => {
  if (
    !options.requestMethod ||
    !options.url ||
    !options.host ||
    !options.callback
  ) {
    return;
  }
  const url = `${options.host}${options.url}`;
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    const data = JSON.parse(xhr.response);
    if (xhr.status >= 200 && xhr.status < 300) {
        options.callback(data);
    } else {
    }
  });

  xhr.open(options.requestMethod, url);
  xhr.send(JSON.stringify(options.body));
};

export default createRequest;
