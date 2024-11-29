import { Body, Container, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

export default function ResetPasswordLink({ email, url }: { email: string; url: string }) {
  return (
    <Html>
      <Head />
      <Preview>Reset Password Link</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">Reset password link</Heading>
            <Text className="text-sm leading-6 text-black">
              You are receiving this email because we received a password reset request for your account.
            </Text>
            <Text className="text-sm leading-6 text-black">Please click the button below to reset your password.</Text>
            <Section className="my-8 text-center">
              <Link className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline" href={url}>
                Reset Password
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">or copy and paste this URL into your browser:</Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-purple-600 no-underline">{url.replace(/^https?:\/\//, '')}</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
