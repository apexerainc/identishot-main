import { z } from "zod";

import { mobileProcedure } from "../../trpc";
import requireUser from "../../utils/requireUser";
import createProject from "@restorationx/db/queries/project/createProject";
import requireOrganization from "../../utils/requireOrganization";
import { TRPCError } from "@trpc/server";

const createNewProject = mobileProcedure
  .input(
    z.object({
      jwt: z.string(),
      name: z.string(),
      location: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const user = await requireUser(ctx.user?.id);
    await requireOrganization(user);
    const { publicId, failed, reason } = await createProject(user.id, {
      name: input.name,
      location: input.location,
    });
    if (!publicId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "An unexpected error occurred, please try again later.",
        cause: "Failed to create project",
      });
    }
    return { publicId };
  });

export default createNewProject;
