"id" IN  (SELECT "UserToOrganization"."organizationId" FROM "UserToOrganization" WHERE "UserToOrganization"."userId" = uid()::text)