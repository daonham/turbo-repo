import { Body, Container, Head, Heading, Html, Preview, Tailwind, Text } from '@react-email/components';

export default function VerifyEmail({ email = '', url = '' }: { email: string; url: string }) {
  return (
    <Html>
      <Head />
      <Preview>App Verification Code</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded-sm border border-solid border-gray-200 px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">Verify your email address</Heading>
            <Text className="mx-auto text-sm leading-6">{`Click the link to verify your email: ${url}`}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
