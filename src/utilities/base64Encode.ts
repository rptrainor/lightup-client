function base64Encode(str: string) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode(parseInt(p1, 16)); // Convert p1 to a number using parseInt
  }));
}

export default base64Encode;
