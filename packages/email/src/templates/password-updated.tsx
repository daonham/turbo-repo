import { Body, Container, Head, Heading, Html, Preview, Tailwind, Text } from '@react-email/components';

export default function PasswordUpdated({ email, verb = 'updated' }: { email: string; verb?: 'reset' | 'updated' }) {
  return (
    <Html>
      <Head />
      <Preview>Your password has been {verb}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">Password has been {verb}</Heading>
            <Text className="text-sm leading-6 text-black">The password has been successfully {verb}.</Text>
            <Text className="text-sm leading-6 text-black">
              If you did not make this change or you believe an unauthorised person has accessed your account, please contact us immediately to secure
              your account.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
