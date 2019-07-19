import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';
export default {
  /**
   * Aqui é definido o lugar onde iremos salvar os arquivos que podem ser na amazonprime
   * mas como a gente vai guardar as fotos localmente utilizamoms o diskstorage do
   * multer para utilizarmos essa opção.*/
  storage: multer.diskStorage({
    /**O destination vai informar o lugar especifico onde os uploads serão guardados
     * que neste caso é dentro da pasta tmp na pasta uploads.
     */
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /**o file name recebe uma função estilo callback como valor */
    filename: (req, file, cb) => {
      /**Gera 16 bytes aleatorios e recebe um cb como paramatro para verificar
       * se deu certo ou não. Se tiver sucesso ele vai converter os 16 bytes
       * no formato hexadecimal e vai adcionar a extenção do arquivo original
       * apos isso > routes files
       */
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
