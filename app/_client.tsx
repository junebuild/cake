// The island registry. Its presence enables /client.js, which hydrates the
// islands AND (because clientRouter is on) boots the morph navigation + dev
// push-HMR. v0.1 is explicit: map each island name to its component.
import { hydrateIslands } from "@junejs/core/islands-client";
import { SaveButton } from "./SaveButton";
import { StatusFeed } from "./StatusFeed";

hydrateIslands({ SaveButton, StatusFeed });
