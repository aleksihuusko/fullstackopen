import Content from './Content';
import Header from './Header';

const Course = ({ course }) => {
  const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <p>
        <strong>total of {totalExercises} exercises</strong>
      </p>
    </>
  );
};

export default Course;
