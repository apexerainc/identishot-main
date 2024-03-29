import { createOption } from "@restorationx/utils/createOption";

import { prisma, SavedOptionType } from "../../../";
import { v4 } from "uuid";

import getUser from "../../user/getUser";
import getIsAdmin from "../getIsAdmin";

const createSavedOption = async (
  userId: string,
  type: SavedOptionType,
  label: string
) => {
  const haloUser = await getUser(userId);
  const organizationId = haloUser?.org?.organization.id;
  if (!organizationId) return { failed: true, reason: "no-org" };

  const isAdmin = await getIsAdmin(organizationId, haloUser.id);
  if (!isAdmin) return false;

  const option = createOption(label);

  return prisma.organizationSavedOption.create({
    data: {
      type,
      organizationId,
      label,
      value: option.value,
      publicId: v4(),
    },
    select: {
      label: true,
      value: true,
      publicId: true,
    },
  });
};

export default createSavedOption;
