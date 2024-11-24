import { RegisterForm } from "./form";

export default async function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-[350px] rounded-lg border bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h1 className="text-xl font-bold text-gray-800">Register</h1>
          <p className="text-sm text-gray-600">
            Please fill out the form below to register. All fields are required.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
