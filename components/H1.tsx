/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function header(props: { text: string }) {
  return (
    <div class={tw`text-4xl font-black`}>
      {props.text}
    </div>
  );
}
