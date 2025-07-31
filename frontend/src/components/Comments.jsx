import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

const Comments = ({ entityId, entityType, comments, setComments }) => {
  const [commentText, setCommentText] = useState("");

  // Obtém usuário autenticado do Redux
  const { userInfo } = useSelector((state) => state.auth);

  // Função para enviar um novo comentário
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error("O comentário não pode estar vazio.");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post("/api/comments", {
        entityId,
        entityType,
        content: commentText,
      }, config);

      setComments([...comments, data]); // Atualiza a lista de comentários
      setCommentText(""); // Limpa o campo de comentário
      toast.success("Comentário adicionado!");
    } catch (error) {
      toast.error("Erro ao adicionar comentário.");
    }
  };

  return (
    <div className="comments-section-container">

    
    <div className="comments-section">
      <h3>Comentários</h3>

      {comments.length === 0 ? (
        <p>Seja o primeiro a comentar!</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              <strong>{comment.user.name}:</strong> {comment.content}
            </li>
          ))}
        </ul>
      )}

      {/* Mostrar formulário apenas para usuários autenticados */}
      {userInfo ? (
        
          
        <form onSubmit={submitHandler}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escreva um comentário..."
            required
          ></textarea>
          <button type="submit">Enviar</button>
        </form>
  
      ) : (
        <p>Faça login para comentar.</p>
      )}
    </div>
    </div>
  );
};

export default Comments;
