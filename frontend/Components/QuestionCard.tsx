type QuestionCardProps = {
  question: string;
};

export default function QuestionCard({
  question,
}: QuestionCardProps) {

  return (
    <div className="mb-10">

      <p className="text-2xl font-semibold">
        {question}
      </p>

    </div>
  );
}