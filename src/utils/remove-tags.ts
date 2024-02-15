export const removeTags = (text: string) => {
  // Substitui todas as ocorrências de <b> e </b> por espaços em branco
  return text.replace(/<\/?b>/g, " ");
};
