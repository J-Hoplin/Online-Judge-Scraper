import { PrismaClient } from '@prisma/client';
import { ColorPrinter } from '../printer';

export class PrismaConnector extends PrismaClient {
  protected adminEmail: string;
  protected adminId: string;
  protected printer = new ColorPrinter();

  constructor() {
    super();
    this.adminEmail = process.env.ADMIN_EMAIL;
    this.user
      .findUniqueOrThrow({
        where: {
          email: this.adminEmail,
        },
      })
      .then((admin) => {
        this.printer.normal('✨Admin credential verified');
        this.adminId = admin.id;
      })
      .catch((err) => {
        this.printer.error('❌Fail to get admin credential.');
        process.exit(1);
      });
  }
}
