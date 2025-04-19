import { Suspense } from "react";
import {Page} from "./checkout";

export default function P() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Page/>
  </Suspense>
}