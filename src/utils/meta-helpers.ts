export function getRobotsData(robotsData: string) {
  const lines = robotsData.trim().split("\n");
  const result: { userAgent: string; allow: string; disallow: string }[] = [];
  let currentObject: { userAgent: string; allow: string; disallow: string } = {
    userAgent: "",
    allow: "",
    disallow: "",
  };

  lines.forEach((line) => {
    if (line.startsWith("User-agent:")) {
      currentObject = {
        userAgent: line.split(": ")[1].trim(),
        allow: "",
        disallow: "",
      };
    } else if (line.startsWith("Disallow:")) {
      currentObject.disallow = line.split(": ")[1].trim();
      result.push(currentObject);
    }
  });

  return result;
}
