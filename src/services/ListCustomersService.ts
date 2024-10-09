import prismaClient from "../prisma";

export class ListCustomerService{
    async execute() {
        const customers = await prismaClient.customer.findMany()

        return customers;
    }
}