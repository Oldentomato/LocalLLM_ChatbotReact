import { Char } from "animatedtxt";

const customH = {
  svgViewBox: { width: 69, height: 81 },
  elements: [
    {
      elementDelay: 0.0,
      shape:
        "M 24 10 C 11 3 38 -4 33 7 C 19 36 19 56 13 65 C 1 89 -4 58 12 52 C 35 42 47 35 58 7 C 60 1 51 -4 52 11 C 53 34 37 49 40 76 C 42 92 47 44 68 58",
      length: 322.86358642578125
    }
  ],
  offsets: {
    left: [0, 0, 0, 0, 0],
    right: [0, 0, 0, 0, 0]
  }
};

export default function CustomCharacter() {
  return (
    <Char
      char={customH}
      font="basic-thin"
      size={200}
      delay={6}
      color="white"
      cubicBezier={[0.68, 0.04, 0.45, 0.98]}
    />
  );
}
