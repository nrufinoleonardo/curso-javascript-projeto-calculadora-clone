// Na Orientação à Objeto (POO) é interessante fazer a separação dos arquivos de modelo, visualização e controle MVC para que se possa, inclusive, reutilizar códigos

window.calculator = new CalcController();

/** No atual arquivo CalcControler (classe presente no arquivo calcController) é instanciada na variável calculator, o que significa que os métodos e atributos são acessíveis.
 * Os Getters e Setters contem os atributos obtidos do html com o metodo .innerHTML
  */
