/** @jsx h */
import { h, JSX } from "preact";
import { tw } from "@twind";

export default function header(
  props: { children: JSX.Element | JSX.Element[] },
) {
  return (
    <div
      class={tw`p-6 mx-auto max-w-screen-md pt-24`}
    >
      {props.children}
    </div>
  );
}
