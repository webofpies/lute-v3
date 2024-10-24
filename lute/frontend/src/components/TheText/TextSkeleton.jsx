import { Skeleton } from "@mantine/core";

export default function TextSkeleton() {
  const headingSize = 20;
  const sentenceSize = 10;
  return (
    <>
      <Skeleton height={headingSize} width="60%" radius="xl" />
      <Skeleton height={sentenceSize} mt={24} radius="xl" />
      {Array(30)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} height={sentenceSize} mt={6} radius="xl" />
        ))}
      <Skeleton height={sentenceSize} mt={6} width="70%" radius="xl" />
    </>
  );
}
