class Public::PostsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
end

  def index
    @posts = Post.all
  end
  
  def show
    @post = Post.find(params[:id])
  end
  
  def new 
    @post = Post.new
  end
  
  def create
    @post = current_user.posts.build(post_params)
    if @post.save
      redirect_to @post, notice: "投稿が成功しました。"
    else
      render :new
    end
  end
  
