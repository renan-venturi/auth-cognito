import { ChainableTemporaryCredentials, Credentials } from "aws-sdk";

export function assumeRoleCredentialsByRoleArn(
  arn?: string
): Credentials | null {
  if (!arn) {
    return null;
  }
  return new ChainableTemporaryCredentials({
    params: {
      RoleArn: arn,
      RoleSessionName: `assumed-role-${
        process.env.ROLE_ASSUMPTION_SESSION_NAME || "unnamed"
      }-${Date.now()}`,
      DurationSeconds: Math.max(
        process.env.ROLE_ASSUMPTION_DURATION_SECONDS
          ? parseInt(process.env.ROLE_ASSUMPTION_DURATION_SECONDS, 10)
          : 0,
        900
      ),
    },
  });
}
