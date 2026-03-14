import CustomerForm from "@/components/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">顧客登録</h1>
      <CustomerForm />
    </main>
  );
}
