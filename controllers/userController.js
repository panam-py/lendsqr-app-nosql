const User = require("../models/userModel");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "An error occured",
      err: err,
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.body.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No user found with that ID.",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "An error occured",
      err: err,
    });
  }
};

exports.fund = async (req, res, next) => {
  try {
    const amount = req.body.amount;

    let newBalance;
    const balance = req.user.balance;
    newBalance = amount + balance;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { balance: newBalance },
      {
        new: true,
        runValidators: true,
      }
    );

    updatedUser.password = undefined;

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
      message: `Account successfully funded with ${amount}, new account balance is ${newBalance}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "failed",
      message: "An error occured",
      err: err.message,
    });
  }
};

exports.withdraw = async (req, res, next) => {
  try {
    const amount = req.body.amount;

    let newBalance;
    const balance = req.user.balance;

    if (amount > balance) {
      return res.status(400).json({
        status: "failed",
        message: `Amount to withdraw ${amount} is greater than user balance ${balance}`,
      });
    }

    newBalance = balance - amount;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { balance: newBalance },
      {
        new: true,
        runValidators: true,
      }
    );

    updatedUser.password = undefined;

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
      message: `${amount} was successfully withdrawn from account. New balance is ${newBalance}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "failed",
      message: "An error occured",
      err: err.message,
    });
  }
};

exports.transfer = async (req, res, next) => {
  try {
    recipientId = req.body.recipientId;
    amount = req.body.amount;

    recipient = await User.findOne({ _id: recipientId });

    if (!recipient) {
      return res.status(400).json({
        status: "failed",
        message: "No user found with that recipient ID",
      });
    }

    let newSenderBalance, newRecipientBalance;
    const senderBalance = req.user.balance;
    const recipientBalance = recipient.balance;

    if (amount > senderBalance) {
      return res.status(400).json({
        status: "failed",
        message:
          "User does not have up to the amount to be transferred in account",
      });
    }

    newSenderBalance = senderBalance - amount;
    newRecipientBalance = recipientBalance + amount;

    const updatedSender = await User.findByIdAndUpdate(
      req.user._id,
      {"balance":newSenderBalance},
      {
        new: true,
        runValidators: true,
      }
    );

    updatedSender.password = undefined;

    const updatedRecipient = await User.findByIdAndUpdate(
      recipient._id,
      {"balance":newRecipientBalance},
      {
        new: true,
        runValidators: true,
      }
    );

    updatedRecipient.password = undefined;

    res.status(200).json({
      status: "success",
      message: `${amount} has successfully been transferred from ${updatedSender.name} with id ${updatedSender._id} to ${updatedRecipient.name} with id ${updatedRecipient.id}`,
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      status: "failed",
      message: "An error occured",
      err: err.message,
    });
  }
};
