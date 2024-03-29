import { prisma } from "../../../";

import { SavedOptionType } from "../../../";

import getUser from "../../user/getUser";
import getIsAdmin from "../getIsAdmin";

const getSavedOptions = async (userId: string, type: SavedOptionType) => {
  const haloUser = await getUser(userId);
  const organizationId = haloUser?.org?.organization.id;
  if (!organizationId) return { failed: true, reason: "no-org" };

  const isAdmin = await getIsAdmin(organizationId, haloUser.id);
  if (!isAdmin) return false;
  console.time();
  const savedOptions = await prisma.organizationSavedOption.findMany({
    where: {
      type,
      organizationId,
      isDeleted: false,
    },
    select: {
      label: true,
      value: true,
      publicId: true,
    },
  });
  console.timeEnd();
  return savedOptions;
};

export default getSavedOptions;
