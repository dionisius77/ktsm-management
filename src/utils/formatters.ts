export const rupiahFormatter: (
  rp: number | string | undefined | null,
) => string = (rp) => {
  if (rp === undefined || rp === null) {
    return "0";
  }

  let srp = rp.toString().replace(/\./g, "").trim();
  const isNegative = srp[0] === "-";
  if (isNegative) {
    srp = srp.slice(1);
  }
  const out: string[] = [];
  let i = 0;
  for (const ch of srp.split("").reverse()) {
    if (i > 0 && i % 3 === 0 && i < srp.length) {
      out.push(".");
    }
    out.push(ch);
    i += 1;
  }
  return `${isNegative ? "-" : ""}${out.reverse().join("")}`;
};