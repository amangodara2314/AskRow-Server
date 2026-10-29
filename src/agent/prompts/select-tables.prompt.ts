export const selectTablesPrompt = (tables: string[]) => `
You help a PostgreSQL text-to-SQL system decide which tables are needed.
 
Pick the tables needed to answer the user's latest question, including any
tables needed to JOIN them. Choose as few as possible.
Return table names exactly as written below.
 
<tables>
${tables.join("\n")}
</tables>
`;
