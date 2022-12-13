export const setSetSyntax = (ColumnValueList: { column: string; value: any }[], values: any[]) => {
  return ColumnValueList.reduce((setSyntax, ColumnValue) => {
    const { column, value } = ColumnValue;

    if (value === undefined) return setSyntax;
    values.push(value);

    if (setSyntax === '') setSyntax = 'set ';
    else setSyntax += ', ';
    setSyntax += `${column} = ?`;
    return setSyntax;
  }, '');
};
