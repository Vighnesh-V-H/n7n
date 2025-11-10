import winston from "winston";

const logLevels = {
  error: 3,
  warn: 2,
  info: 1,
  debug: 0,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
};

winston.addColors(logColors);

const getLogLevelFromNumber = (num: string | undefined): string => {
  const levelMap: Record<string, string> = {
    "0": "debug",
    "1": "info",
    "2": "warn",
    "3": "error",
  };
  return levelMap[num || "1"] || "info";
};

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/combined.log" }),
];

export const logger = winston.createLogger({
  level: getLogLevelFromNumber(process.env.LOG_LEVEL),
  levels: logLevels,
  format,
  transports,
});
