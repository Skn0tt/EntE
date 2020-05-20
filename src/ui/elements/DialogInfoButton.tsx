import InfoIcon from "@material-ui/icons/Info";
import { IconButton } from "@material-ui/core";

interface DialogInfoButtonProps {
  href: string;
}

export function DialogInfoButton(props: DialogInfoButtonProps) {
  const { href } = props;
  return (
    <IconButton
      href={href}
      target="_blank"
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
      }}
    >
      <InfoIcon />
    </IconButton>
  );
}
