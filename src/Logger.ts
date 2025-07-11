export class Logger {
  static info(msg: string) {
    console.log(`ℹ️ [INFO] ${new Date().toISOString()} - ${msg}`);
  }

  static warn(msg: string) {
    console.warn(`⚠️ [WARN] ${new Date().toISOString()} - ${msg}`);
  }

  static error(msg: string) {
    console.error(`❌ [ERROR] ${new Date().toISOString()} - ${msg}`);
  }
}
