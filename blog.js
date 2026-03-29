const inquirer = require('inquirer');
const fs = require('fs-extra');

const FILE = 'posts.json';

async function loadPosts() {
  try {
    return await fs.readJson(FILE);
  } catch {
    return [];
  }
}

async function savePosts(posts) {
  await fs.writeJson(FILE, posts, { spaces: 2 });
}

async function createPost() {
  const answers = await inquirer.prompt([
    { name: 'title', message: 'Post title:' },
    { name: 'content', message: 'Post content:' }
  ]);

  const posts = await loadPosts();
  posts.push(answers);
  await savePosts(posts);

  console.log('Post created!');
}

async function viewPosts() {
  const posts = await loadPosts();
  posts.forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.title}`);
    console.log(p.content);
  });
}

async function deletePost() {
  const posts = await loadPosts();

  const choices = posts.map((p, i) => ({
    name: p.title,
    value: i
  }));

  const { index } = await inquirer.prompt([
    { type: 'list', name: 'index', message: 'Delete which post?', choices }
  ]);

  posts.splice(index, 1);
  await savePosts(posts);

  console.log('Post deleted!');
}

async function main() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose action:',
      choices: ['Create Post', 'View Posts', 'Delete Post']
    }
  ]);

  if (action === 'Create Post') await createPost();
  if (action === 'View Posts') await viewPosts();
  if (action === 'Delete Post') await deletePost();
}

main();
