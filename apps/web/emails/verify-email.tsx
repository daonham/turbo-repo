import { Body, Container, Head, Heading, Html, Preview, Section, Tailwind, Text } from '@react-email/components';

export default function VerifyEmail({ email = '', code = '' }: { email: string; code: string }) {
  return (
    <Html>
      <Head />
      <Preview>App Verification Code</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">Please confirm your email address</Heading>
            <Text className="mx-auto text-sm leading-6">Enter this code to complete your sign up:</Text>
            <Section className="my-8">
              <div className="mx-auto w-fit rounded-xl px-6 py-3 text-center font-mono text-2xl font-semibold tracking-[0.25em]">{code}</div>
            </Section>
            <Text className="text-sm leading-6 text-black">This code expires in 10 minutes.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
