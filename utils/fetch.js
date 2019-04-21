export async function fetchHTML(url) {
  const res = await fetch(url);
  const html = await res.text();
  return new DOMParser().parseFromString(html, 'text/html');
}