// The drawing of org:eu, written by hand: 3:2, twelve five-pointed gold stars, one point up, on a circle whose radius is a third of the height, centred on the flag and spaced as the hours of a clock; each star's points lie on a circle of a eighteenth of the height.

/** The European Union's flag, as an SVG string: viewBox 900 by 600 (3:2). Loaded by the entry when it is asked for. */
const svg = "<svg data-hata-org=\"eu\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 900 600\"><defs><path id=\"org-eu-star\" fill=\"#fc0\" d=\"M0 -33.33L7.48 -10.3L31.7 -10.3L12.11 3.93L19.59 26.97L0 12.73L-19.59 26.97L-12.11 3.93L-31.7 -10.3L-7.48 -10.3z\"/></defs><path fill=\"#039\" d=\"M0 0h900v600H0z\"/><use href=\"#org-eu-star\" x=\"450\" y=\"100\"/><use href=\"#org-eu-star\" x=\"550\" y=\"126.79\"/><use href=\"#org-eu-star\" x=\"623.21\" y=\"200\"/><use href=\"#org-eu-star\" x=\"650\" y=\"300\"/><use href=\"#org-eu-star\" x=\"623.21\" y=\"400\"/><use href=\"#org-eu-star\" x=\"550\" y=\"473.21\"/><use href=\"#org-eu-star\" x=\"450\" y=\"500\"/><use href=\"#org-eu-star\" x=\"350\" y=\"473.21\"/><use href=\"#org-eu-star\" x=\"276.79\" y=\"400\"/><use href=\"#org-eu-star\" x=\"250\" y=\"300\"/><use href=\"#org-eu-star\" x=\"276.79\" y=\"200\"/><use href=\"#org-eu-star\" x=\"350\" y=\"126.79\"/></svg>";

export { svg };
export default svg;
