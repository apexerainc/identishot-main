import { prisma } from "@restorationx/db";
import getMembers from "@restorationx/db/queries/organization/getMembers";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { mobileProcedure } from "../../trpc";
import requireOrganization from "../../utils/requireOrganization";
import requireProject from "../../utils/requireProject";
import requireUser from "../../utils/requireUser";
import createInference from "@restorationx/db/queries/inference/createInference";
import addImage from "@restorationx/db/queries/project/addImageToProject";
import getOrCreateRoom, {
  getRoomById,
} from "@restorationx/db/queries/room/getOrCreateRoom";
export const UNKNOWN_ROOM = "Unknown Room";

const addImageToProject = mobileProcedure
  .input(
    z.object({
      projectPublicId: z.string(),
      jwt: z.string(),
      imageKey: z.string(),
      publicRoomId: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const user = await requireUser(ctx.user?.id);
    const organization = await requireOrganization(user);
    const project = await requireProject(
      input.projectPublicId,
      organization.id
    );

    const image = await addImage(
      user.id,
      input.projectPublicId,
      encodeURIComponent(input?.imageKey)
    );
    console.log("image", image);
    if (!image) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "An unexpected error occurred, please try again later.",
        cause: "Failed to create image",
      });
    }
    let roomName;

    try {
      if (input.publicRoomId) {
        let room = await getRoomById(image.projectId, input.publicRoomId);
        roomName = room?.name;
      } else {
        roomName === UNKNOWN_ROOM;
      }
    } catch (e) {
      console.error("Error detecting room");
      roomName = UNKNOWN_ROOM;
    }

    if (!roomName) {
      roomName = UNKNOWN_ROOM;
    }

    const { room: inferenceRoom, didCreateRoom } = await getOrCreateRoom(
      image.projectId,
      roomName
    );

    if (!inferenceRoom) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "An unexpected error occurred, please try again later.",
        cause: "Failed to create room",
      });
    }

    const inference = await createInference(image.publicId, inferenceRoom.id);

    if (!inference) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "An unexpected error occurred, please try again later.",
        cause: "Failed to create inference",
      });
    }
    return true;
  });

export default addImageToProject;
