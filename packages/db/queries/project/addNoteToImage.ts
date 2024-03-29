import { prisma } from "../../";

import { v4 as uuidv4 } from "uuid";
import getUser from "../user/getUser";
import getProjectForOrg from "../project/getProjectForOrg";

const addNoteToImage = async (
  userId: string,
  projectPublicId: string,
  imageId: number,
  body?: string,
  mentions?: string[]
) => {
  const identishotUser = await getUser(userId);
  const organizationId = identishotUser?.org?.organization.id;
  if (!organizationId) {
    console.error("No org");
    return null;
  }

  const project = await getProjectForOrg(projectPublicId, organizationId);
  if (!project) {
    console.error("No project");
    return null;
  }

  return prisma.imageNote.create({
    data: {
      body: body || "",
      userId,
      mentions: mentions || [],
      imageId,
    },
  });
};

export default addNoteToImage;
