---
title: Git删除已提交commit的步骤
date:  2018-07-14
---
#### 查看log，确认要删除的commit的id

```
git log
```

#### 回退到此commit id

```
git revert <commit-id>
```

#### 暂时存储变更

```
git stash
```

#### 强制更新远程库

```
git push --force
```
> 此命令会将所有commit-id之后的提交从历史记录里删除，慎用
#### 将暂存的变更找回

```
git stash pop
```

#### 重新修改后再次提交

```
git add --all
git commit -m 'fix: new commit message'
```

### 参考

+ [How can I remove a commit on GitHub?](https://stackoverflow.com/questions/448919/how-can-i-remove-a-commit-on-github)