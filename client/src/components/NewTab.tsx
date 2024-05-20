import { FC } from "react";

interface Props {
  link: string;
  title: string;
}

const NewTab: FC<Props> = ({ link, title }) => {
  return (
    <a target="_blank" href={link}>
      {title}
    </a>
  );
};

export default NewTab;
