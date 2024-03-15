import {useState, useEffect} from 'react'
import styles from './BlogDetail.module.css'
import { useSelector } from 'react-redux'
import { useParams , useNavigate } from 'react-router-dom'
import CommentList from '../../Components/CommentList/CommentList'
import {getBlogById,getCommentsById,postComment,deleteBlog} from '../../api/internal'
import Loader from '../../Components/Loader/Loader'

function BlogDetail() {


    const [blog , setBlog] = useState([])
    const [comments , setComments] = useState([]);
    const [ownsBlog , setOwnsBlog] =useState(false);
    const [newComment , setNewComment] =useState('')
    const [reload , setReload] = useState(false)

    const params = useParams();
    const blogId = params.id;
    const navigate = useNavigate();

    const username=useSelector(state=>state.user.username)
    const userId=useSelector(state=>state.user._id)

    useEffect(()=>{
        async function getBlogDetails(){
            const commentResponse = await getCommentsById(blogId)

            if(commentResponse.status===200){
                setComments(commentResponse.data.data)
            }

            const blogResponse = await getBlogById(blogId)

            if(commentResponse.status===200){
            setOwnsBlog(username===blogResponse.data.blog.authorUsername)
            setBlog(blogResponse.data.blog)
            }
        }
        getBlogDetails()
    },[reload])
    
    console.log(blog)

    const postCommenthandler = async()=>{
        const data = {
            author:userId,
            blog:blogId,
            content:newComment
        }
        const response = await postComment(data);

        if(response.status===201){
            setNewComment('')
            setReload(!reload)
        }
    }

    const deleteBlogHandler = async ()=>{
        const response = await deleteBlog(blogId)

        if(response.status===200){
            navigate('/')
        }
    }
    if (blog.length === 0) {
        <Loader text="blog details"/>
    }

  return (
    <div className={styles.detailsWrapper}>
        <div className={styles.left}>
            <h1 className={styles.title}>{blog.title}</h1>
            <div className={styles.meta}>
          <p>
            @
            {blog.authorUsername +
              " on " +
              new Date(blog.createdAt).toDateString()}
          </p>
        </div>
            <div className={styles.photo}>
                <img src={blog.photo} width={250} height={250}/>
            </div>
            <p className={styles.content}>{blog.content}</p>
            
            {ownsBlog && (
                <div className={styles.controls}>
                    <button className={styles.editButton} onClick={()=>navigate(`/blog/update/${blog._id}`)}>Edit</button>
                    <button className={styles.deleteButton} onClick={deleteBlogHandler}>Delete</button>
                 </div>
                )
            }
        </div>
        <div className={styles.right}>
            <div className={styles.commentWrapper}>
                <CommentList comments={comments}/>
                <div className={styles.postComment}>
                    <input className={styles.input}
                    placeholder='comment' value={newComment}
                    onChange={(e)=>setNewComment(e.target.value)}/>

                    <button className={styles.postCommentButton} 
                    onClick={postCommenthandler}>Post</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BlogDetail